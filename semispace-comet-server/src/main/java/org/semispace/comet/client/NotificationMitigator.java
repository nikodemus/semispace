/*
 * Copyright 2010 Erlend Nossum
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.semispace.comet.client;

import org.cometd.Client;
import org.cometd.Message;
import org.cometd.MessageListener;
import org.cometd.client.BayeuxClient;
import org.semispace.SemiEventListener;
import org.semispace.SemiLease;
import org.semispace.comet.common.CometConstants;
import org.semispace.comet.server.SemiSpaceCometListener;
import org.semispace.event.SemiAvailabilityEvent;
import org.semispace.event.SemiEvent;
import org.semispace.event.SemiExpirationEvent;
import org.semispace.event.SemiRenewalEvent;
import org.semispace.event.SemiTakenEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * Maintain the client side of a notification.
 */
public class NotificationMitigator implements SemiLease {
    private static final Logger log = LoggerFactory.getLogger(NotificationMitigator.class);
    private MitigationListener mitigationListener;
    private BayeuxClient client;
    private boolean isAttached;
    private int callId;

    public NotificationMitigator(BayeuxClient client, int callId, SemiEventListener listener) {
        this.client = client;
        this.mitigationListener = new MitigationListener(callId, listener);
        this.callId = callId;
        isAttached = false;
    }

    protected void attach() {
        if ( ! isAttached ) {
            log.debug("Attaching "+CometConstants.NOTIFICATION_EVENT_CHANNEL+"/"+callId);
            client.addListener(mitigationListener);
            isAttached = true;
        } else {
            throw new RuntimeException("Usage error - already attached.");
        }
    }

    /**
     * TODO Error in logic: As of now, the listener will only be detached if it
     * is done by the cancel method... Need timeout thread
     */
    private boolean detach() {
        if (  isAttached ) {
            log.debug("... Detaching");
            boolean cancelResult = sendCancelListener();
            client.removeListener(mitigationListener);
            client.unsubscribe(CometConstants.NOTIFICATION_EVENT_CHANNEL+"/"+callId);
            isAttached = false;
            return cancelResult;
        } else {
            return false;
        }
    }

    private boolean sendCancelListener() {
        try {
            log.debug("Publishing cancellation of lease with channel id "+callId);
            final CancelResultListener cancelListener = new CancelResultListener( callId );
            client.addListener( cancelListener );
            Map map = new HashMap<String, String>();
            map.put( "callId", ""+callId );
            log.trace("Awaiting...");
            // Should be able to write an element within 5 seconds
            client.publish(CometConstants.NOTIFICATION_CALL_CANCEL_LEASE_CHANNEL+"/"+callId, map, null );
            boolean finishedOk = cancelListener.getLatch().await(5, TimeUnit.SECONDS);
            if ( !finishedOk) {
                log.warn("Could not write element within 5 seconds. That is not to savory. Problem with connection?");
            }
            log.trace("... unlatched");
            client.removeListener(cancelListener);
            return true;
        } catch (Throwable t ) {
            log.error("Could not cancel listener", t);
        }
        return false;
    }

    @Override
    public boolean cancel() {
        return detach();
    }

    @Override
    public boolean renew(long duration) {
        log.debug("Never renewing notification mitigator.");
        return false;
    }

    @Override
    public long getHolderId() {
        throw new RuntimeException("Not supported");
    }

    private static class MitigationListener implements MessageListener {
        private final int callId;
        private SemiEventListener listener;

        private MitigationListener(int callId, SemiEventListener listener) {
            this.callId = callId;
            this.listener = listener;
        }

        @Override
        public void deliver(Client from, Client to, Message message) {
            try {
                //log.debug("from.getId: "+(from==null?"null":from.getId())+" Ch: "+message.getChannel()+" message.clientId: "+message.getClientId()+" id: "+message.getId()+" data: "+message.getData());
                deliverInternal(from, to, message);
            } catch (Throwable t ) {
                log.error("Got an unexpected exception treating message.", t);
                throw new RuntimeException("Unexpected exception", t);
            }
        }
        private void deliverInternal(Client from, Client to, Message message) {
            if (message.getChannel().startsWith(CometConstants.NOTIFICATION_EVENT_CHANNEL+"/"+callId+"/")) {
                log.trace("Channel: "+message.getChannel()+" client id "+message.getClientId()+" "+message.getData());
                Map<String,String> map = (Map) message.getData();
                final String objectId = map.get("objectId");
                SemiEvent event = createEvent(message.getChannel().substring(message.getChannel().lastIndexOf("/")+1), Long.valueOf( objectId ));
                listener.notify(event);
            } else {
                // TODO log.warn("Unexpected channel "+message.getChannel());
            }
        }

        private SemiEvent createEvent(String type, Long objectId) {
            if ( type.equals(SemiSpaceCometListener.EVENT_AVAILABILITY)) {
                return new SemiAvailabilityEvent(objectId);
            } else if ( type.equals(SemiSpaceCometListener.EVENT_TAKEN)) {
                return new SemiTakenEvent(objectId);
            }  else if ( type.equals(SemiSpaceCometListener.EVENT_EXPIRATION)) {
                return new SemiExpirationEvent(objectId);
            } else if (  type.equals(SemiSpaceCometListener.EVENT_RENEW)) {
                // TODO Duration is wrong
                return new SemiRenewalEvent(objectId, 1000);
            } else {
                throw new RuntimeException("Unexpected event type: "+type);
            }
        }
    }

    private class CancelResultListener implements MessageListener {
        private final CountDownLatch latch;
        private final int callId;

        public CancelResultListener(int callId) {
            this.callId = callId;
            this.latch = new CountDownLatch(1);
        }

        public CountDownLatch getLatch() {
            return latch;
        }

        @Override
        public void deliver(Client from, Client to, Message message) {
            try {
                deliverInternal(from, to, message);
            } catch (Throwable t ) {
                log.error("Got an unexpected exception treating message.", t);
                throw new RuntimeException("Unexpected exception", t);
            }
        }

        private void deliverInternal(Client from, Client to, Message message) {
            if ((CometConstants.NOTIFICATION_REPLY_CANCEL_LEASE_CHANNEL+"/"+callId).equals(message.getChannel())) {
                log.trace("Channel: "+message.getChannel()+" client id "+message.getClientId());
                latch.countDown();
            } else {
                // TODO log.warn("Unexpected channel "+message.getChannel());
            }
        }
    }
}
