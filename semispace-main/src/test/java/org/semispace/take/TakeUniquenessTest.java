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

package org.semispace.take;

import junit.framework.TestCase;
import org.semispace.SemiSpace;
import org.semispace.StressTestConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Testing uniqueness of take. Thanks to <b>Chris Mcfarlen</b> of Yahoo for providing the
 * scenario and the initial test code.
 */
public class TakeUniquenessTest extends TestCase {
    private static final Logger log = LoggerFactory.getLogger(TakeUniquenessTest.class);

    public void testMultipleInsertAndTake()  {
        Thread[] threads = new Thread[6];

        log.debug("Starting up " + threads.length + " workers.");
        for (int t = 0; t < threads.length; t++) {
            threads[t] = new Thread(new UniqueWorker(5, StressTestConstants.ITERATIONS_TO_PERFORM));
            threads[t].start();
        }

        for (Thread thread : threads) {
            try {
                thread.join();
            } catch (InterruptedException e) {
                throw new RuntimeException("Error", e);
            }
        }
        Item result = SemiSpace.retrieveSpace().takeIfExists( new Item());
        assertNull( "Expecting all elements to have been removed from space, but had: "+result, result );
        log.debug("All threads joined!");
        assertEquals("Not expecting any residual items. Collected errors: "+Storage.getInstance().getErrors(), 0, Storage.getInstance().dumpItems());
        assertEquals("Not expecting errors", "", Storage.getInstance().getErrors());
    }
}
