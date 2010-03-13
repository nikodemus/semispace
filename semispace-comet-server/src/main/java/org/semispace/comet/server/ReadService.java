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

package org.semispace.comet.server;

import org.cometd.Bayeux;
import org.cometd.Client;
import org.cometd.Message;
import org.cometd.server.BayeuxService;
import org.semispace.SemiSpace;
import org.semispace.comet.common.CometConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Supporting semispace read.
 */
public class ReadService extends BayeuxService {
    private static final Logger log = LoggerFactory.getLogger(ReadService.class);
    private final SemiSpace space;
    private ExecutorService threadPool = Executors.newCachedThreadPool();
    
    public ReadService(Bayeux bayeux, SemiSpace space ) {
        super(bayeux, "read");
        subscribe(CometConstants.READ_CALL_CHANNEL+"/*", "semispaceRead");
        this.space = space;
    }

    public void semispaceRead(final Client remote, final Message message) {
        log.trace("Remote id "+remote.getId()+" Ch: "+message.getChannel()+" clientId: "+message.getClientId()+" id: "+message.getId()+" data: "+message.getData());

        final Map<String, Object> data = (Map<String, Object>) message.getData();
        final Long duration = Long.valueOf((String) data.get("duration"));
        final Map<String, String> searchMap = (Map<String, String>) data.get("searchMap");
        final String outChannel = message.getChannel().replace("/call/", "/reply/");
        searchMap.put("class", searchMap.remove(CometConstants.OBJECT_TYPE_KEY));

        Runnable queryResult = new Runnable() {
            @Override
            public void run() {
                String result = space.findOrWaitLeaseForTemplate(searchMap, duration.longValue(), false);
                // log.debug("Did "+(result == null?"NOT":"")+" get a result: "+result);

                Map<String, String> output = new HashMap<String, String>();
                if ( result != null ) {
                    output.put("result", result);
                    log.trace("read ended up with a result");
                } else {
                    log.trace("read did not get a result");
                }
                try {
                    remote.deliver(getClient(), outChannel, output, null);
                } catch ( Throwable t ) {
                    log.error("Got a problem delivering", t);
                } finally {
                    log.trace("======== delivered READ on channel {} - done", outChannel);
                }
            }
        };
        threadPool.submit(queryResult);
    }
}
