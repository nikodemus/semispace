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
import org.semispace.SemiLease;
import org.semispace.comet.common.CometConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Maintain the client side of a notification.
 */
public class NotificationMitigator implements SemiLease {
    private static final Logger log = LoggerFactory.getLogger(NotificationMitigator.class);
    private MitigationListener mitigationListener;
    private String channel;
    private BayeuxClient client;

    public NotificationMitigator( BayeuxClient client, int callId ) {
        this.client = client;
        this.mitigationListener = new MitigationListener(callId);
        this.channel = CometConstants.NOTIFICATION_REPLY_CHANNEL+"/"+callId;
    }

    protected void attach() {
        log.debug("Attaching");
        client.addListener(mitigationListener);
        client.subscribe(channel);
    }

    /**
     * TODO Error in logic: As of now, the listener will only be detached if it
     * is done by the cancel method...
     */
    private void detach() {
        log.debug("Detaching");
        client.removeListener(mitigationListener);
        client.unsubscribe(channel);
    }

    @Override
    public boolean cancel() {
        detach();
        return true;
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

        public MitigationListener(int callId) {
            this.callId = callId;
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
            if ((CometConstants.NOTIFICATION_REPLY_CHANNEL+"/"+callId).equals(message.getChannel())) {
                log.trace("Channel: "+message.getChannel()+" client id "+message.getClientId());
            } else {
                // TODO log.warn("Unexpected channel "+message.getChannel());
            }
        }
    }

}