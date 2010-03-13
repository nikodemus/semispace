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
    public static final String READ_CALL_CHANNEL = "/semispace/call/readOrTake";
    public static final String READ_REPLY_CHANNEL = "/semispace/reply/readOrTake";
    public static final String WRITE_CALL_CHANNEL = "/semispace/call/write";
    public static final String WRITE_REPLY_CHANNEL = "/semispace/reply/write";
    /**
     * Need to translate internal class type identifier with object type key
     */
    public static final String OBJECT_TYPE_KEY = "semispaceObjectTypeKey";
}
