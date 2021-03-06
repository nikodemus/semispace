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

package org.semispace.comet.common;

/**
 * Constants used in comet communication.
 */
public class CometConstants {
    public static final String READ_CALL_CHANNEL = "/service/semispace/call/read";
    public static final String READ_REPLY_CHANNEL = "/service/semispace/reply/read";
    public static final String TAKE_CALL_CHANNEL = "/service/semispace/call/take";
    public static final String TAKE_REPLY_CHANNEL = "/service/semispace/reply/take";
    public static final String WRITE_CALL_CHANNEL = "/service/semispace/call/write";
    public static final String WRITE_REPLY_CHANNEL = "/service/semispace/reply/write";
    public static final String NOTIFICATION_CALL_CHANNEL = "/service/semispace/call/notify";
    public static final String NOTIFICATION_REPLY_CHANNEL = "/service/semispace/reply/notify";
    public static final String NOTIFICATION_EVENT_CHANNEL = "/service/semispace/event/notify";
    public static final String NOTIFICATION_CALL_CANCEL_LEASE_CHANNEL = "/service/semispace/call/leasecancel";
    public static final String NOTIFICATION_REPLY_CANCEL_LEASE_CHANNEL = "/service/semispace/reply/leasecancel";
    /**
     * Need to translate internal class type identifier with object type key
     */
    public static final String PAYLOAD_MARKER = "json";
    public static final String EVENT_EXPIRATION = "expiration";
    public static final String EVENT_AVAILABILITY = "availability";
    public static final String EVENT_TAKEN = "taken";
    public static final String EVENT_RENEW = "renewal";
    public static final String EVENT_ALL = "all";
}
