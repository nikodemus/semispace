/*
 * ============================================================================
 *
 *  File:     TerraSpaceTest.java
 *----------------------------------------------------------------------------
 *
 * No copying allowed without explicit permission.
 *
 *  All rights reserved.
 *
 *  Description:  See javadoc below
 *
 *  Created:      24. des.. 2007
 * ============================================================================ 
 */

package org.semispace;

import junit.framework.TestCase;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Tests targeted to test terracotta integration.
 */
public class TerraSpaceTest extends TestCase {
    private static final Logger log = LoggerFactory.getLogger(TerraSpaceTest.class);
            
    // Used in a test:
    private String problem=null;
    private SemiSpaceInterface space;
    
    protected SemiSpace getSpace() {
        return (SemiSpace)space;
    }
    
    @Override
    public void setUp() {
        space = SemiSpace.retrieveSpace();
        problem = null;
        // If running within eclipse, you will have this on your classpath
        //space = SemiSpaceProxy.retrieveSpace("http://localhost:8080/semispace-war/services/space");
    }

    public void testWrite() {
        FieldHolder fh = new FieldHolder();
        fh.setFieldA("a");
        fh.setFieldB("b");

        space.write( null, 100 );
        assertNull( space.readIfExists(new FieldHolder()));
        space.write(fh,1000);
        space.write(fh,1000);
        assertNotNull(space.takeIfExists(fh));
        assertNotNull("I put two elements in space, and both should exist.", space.takeIfExists(fh));
        assertNull(space.readIfExists(fh));
    }

    public void testRead() throws InterruptedException {
        FieldHolder fh = new FieldHolder();
        fh.setFieldA("a");
        fh.setFieldB("b");

        space.write(fh,100);
        assertNotNull(space.takeIfExists(fh));
        Thread.sleep(110);
        assertNull(space.takeIfExists(fh));
    }

    public void testAsync() throws InterruptedException {
        Runnable r = new Runnable() {
            public void run() {
                try {
                    FieldHolder fh = new FieldHolder();
                    fh.setFieldA("a");
                    fh.setFieldB("b");

                    Thread.sleep(350);
                    space.write(fh, 2500);
                    //System.out.println("Added element.");
                } catch (InterruptedException e) {
                    // Intentional
                }
            }
        };
        new Thread( null, r ).start();
        FieldHolder read = new FieldHolder();
        read.setFieldA("a");
        Thread.sleep(100);
        assertNull(space.readIfExists(read));
        assertNotNull(space.take(read, 6000));
    }
    
    public void testPreciseRead() throws InterruptedException {
        FieldHolder fh1 = new FieldHolder();
        FieldHolder fh2 = new FieldHolder();
        fh1.setFieldA("1-a");
        fh2.setFieldA("2-a");
        fh1.setFieldB("1-b");
        fh2.setFieldB("2-b");
        space.write(fh1, 9999);
        space.write(fh2, 9999);
        // Just empty
        space.write(new FieldHolder(), 9999);
        
        FieldHolder template = new FieldHolder();
        template.setFieldA(fh2.getFieldA());
        assertNotNull("Existing element should be found", space.readIfExists(template));

        template.setFieldA("xx");
        FieldHolder elem = space.takeIfExists(template);
        assertNull("Non-existing element should not be found, but when querying with "+template+" I got: "+elem, elem);
        assertNotNull(space.takeIfExists(new FieldHolder()));
        assertNotNull(space.takeIfExists(new FieldHolder()));
        assertNotNull("Last of written elements", space.takeIfExists(new FieldHolder()));
        assertNull("All elements should be removed", space.takeIfExists(new FieldHolder()));
    }
    
    public void testQuantity() {
        FieldHolder templ = new FieldHolder();
        assertNull("Should not start with elements present", space.takeIfExists(templ));
        templ.setFieldA("a");

        for ( int i=0 ; i < 1000 ; i++ ) {
            FieldHolder fh = new FieldHolder();
            fh.setFieldA("a");
            fh.setFieldB("b");
            
            space.write(fh, 29999);
        }
        for ( int i=0 ; i < 1000 ; i++ ) {
            assertNotNull("Notice that this may be due to slow computer... Missing element at "+i, space.takeIfExists(templ));
        }
        assertNull("Should not have any elements left", space.takeIfExists(templ));
    }

    public void testQuantity2() {
        FieldHolder shouldBeNull = space.takeIfExists(new FieldHolder());
        assertNull("Should not start with elements present: "+shouldBeNull, shouldBeNull);
        
        Runnable insert = new Runnable( ) {
            public void run() {
                for ( int i=0 ; i < 1000 ; i++ ) {
                    FieldHolder fh = new FieldHolder();
                    fh.setFieldA("a");
                    fh.setFieldB("b");                    
                    space.write(fh, 5000);
                    if ( i % 100 == 0 ) {
                        log.debug("Write statistics: "+((SemiSpace)space).getStatistics());
                    }
                }
            }
        };
        new Thread(insert).start();
        FieldHolder templ = new FieldHolder();
        templ.setFieldA("a");
        for ( int i=0 ; i < 1000 ; i++ ) {
            if ( i % 100 == 0 ) {
                log.debug("Take statistics: "+((SemiSpace)space).getStatistics());
            }
            assertNotNull("Notice that this may be due to slow computer... Failed when tried to take element "+i+". Statistics: "+((SemiSpace)space).getStatistics(), space.take(templ,5000));
        }
        assertNull("Should not have any elements left", space.takeIfExists(templ));
    }

    public void testQuantity3() {
        FieldHolder shouldBeNull = space.takeIfExists(new FieldHolder());
        assertNull("Should not start with elements present: "+shouldBeNull, shouldBeNull);

        for ( int i=0 ; i < 1000 ; i++ ) {
            FieldHolder fh = new FieldHolder();
            fh.setFieldA("a");
            fh.setFieldB(""+i);

            space.write(fh, 29999);
        }
        for ( int i=0 ; i < 1000 ; i++ ) {
            FieldHolder templ = new FieldHolder();
            templ.setFieldA("a");
            templ.setFieldB(""+i);
            assertNotNull("Notice that this may be due to slow computer... Missing element at "+i, space.takeIfExists(templ));
        }
        assertNull("Should not have any elements left", space.takeIfExists(new FieldHolder()));
    }

    public void testAlternateHolder() {
        AlternateHolder ah = new AlternateHolder();
        ah.fieldA = "a";
        ah.fieldB = "b";
        space.write(ah, 1000);
        assertNotNull(space.readIfExists(new AlternateHolder()));
        AlternateHolder non = new AlternateHolder();
        non.fieldA = "x";
        assertNull(space.readIfExists(non));
        non.fieldA = "a";
        assertNotNull(space.readIfExists(non));
        assertNotNull(space.takeIfExists(non));
    }
    
    public void testDifferentObjects() {
        while ( space.takeIfExists(new FieldHolder()) != null ) {
            // Intentional
        }
        AlternateHolder ah = new AlternateHolder();
        ah.fieldA = "a";
        ah.fieldB = "b";
        space.write(ah, 1000);
        FieldHolder fh = new FieldHolder();
        fh.setFieldA("a");
        fh.setFieldB("b");
        space.write(fh, 1000);
        Object taken = space.take(new FieldHolder(),100);
        assertNotNull(taken);
        taken = space.takeIfExists(new FieldHolder());
        assertNull("Should not exist twice: "+taken, taken);
        assertNotNull(space.takeIfExists(new AlternateHolder()));
        assertNull(space.takeIfExists(new AlternateHolder()));
    }


    public void testAsyncWithFourThreads() throws InterruptedException {
        Runnable write = new Runnable() {
            public void run() {
                    FieldHolder fh = new FieldHolder();
                    fh.setFieldA("a");
                    fh.setFieldB("b");
                    for ( int i=0 ; i < 500 ; i++ ) {
                        space.write(fh, 19500);
                    }
            }
        };
        Runnable write2 = new Runnable() {
            public void run() {
                AlternateHolder ah = new AlternateHolder();
                ah.fieldA = "a";
                ah.fieldB = "b";
                for ( int i=0 ; i < 500 ; i++ ) {
                    space.write(ah, 19500);
                }
            }
        };
        Runnable read = new Runnable() {
            public void run() {
                FieldHolder fh = new FieldHolder();
                fh.setFieldA("a");
                fh.setFieldB("b");

                for ( int i=0 ; i < 500 ; i++ ) {
                    if (space.take(fh, 19500) == null && problem == null ) {
                        problem = "Got null when taking element "+i;
                    }
                }
            }
        };
        Runnable read2 = new Runnable() {
            @SuppressWarnings("synthetic-access")
            public void run() {
                AlternateHolder ah = new AlternateHolder();
                ah.fieldA = "a";
                ah.fieldB = "b";

                for ( int i=0 ; i < 500 ; i++ ) {
                    if (space.take(ah, 19500) == null && problem == null ) {
                        problem = "Got null when taking element "+i;
                    }
                }
            }
        };
        Thread a = new Thread( null, write );
        Thread b = new Thread( null, read );
        Thread c = new Thread( null, write2 );
        Thread d = new Thread( null, read2 );
        
        a.start();
        b.start();
        c.start();
        d.start();
        a.join();
        b.join();
        c.join();
        d.join();
        FieldHolder fx = new FieldHolder();
        fx.setFieldA("a");
        assertNull("Should have consumed all of the elements. Still have some.", space.readIfExists(fx));
        AlternateHolder ah = new AlternateHolder();
        ah.fieldA = "a";
        assertNull("Should have consumed all of the elements. Still have some alternate versions.", space.readIfExists(ah));
        assertNull(problem, problem );
    }


    public void testAsyncWithFourThreadsAndId() throws InterruptedException {
        final int numberOfIterations = 100; // TODO Seems to fail if numIt > 1000
        Runnable write = new Runnable() {
            public void run() {
                    FieldHolder fh = new FieldHolder();
                    fh.setFieldA("a");
                for ( int i=0 ; i < numberOfIterations ; i++ ) {
                    fh.setFieldB("b"+i);
                    space.write(fh, SemiSpace.ONE_DAY);
                }
                log.debug("Writer thread 1 finished");
            }
        };
        Runnable write2 = new Runnable() {
            public void run() {
                FieldHolder fh = new FieldHolder();
                fh.setFieldB("b");
                for ( int i=0 ; i < numberOfIterations ; i++ ) {
                    fh.setFieldA("a"+i);
                    space.write(fh, SemiSpace.ONE_DAY);
                }
                log.debug("Writer thread 2 finished");
            }
        };
        Runnable read = new Runnable() {
            public void run() {
                FieldHolder fh = new FieldHolder();
                fh.setFieldA("a");

                for ( int i=0 ; i < numberOfIterations ; i++ ) {
                    fh.setFieldB("b"+i);
                    if (problem == null ) {
                        FieldHolder r= space.take(fh, 19500);
                        if (  r == null ) {
                            problem = "Got null when taking element b"+i;
                        } else if ( !r.getFieldA().equals(fh.getFieldA()) ||
                                !r.getFieldB().equals(fh.getFieldB())) {
                            problem = "Rather disturbing. When querying for "+fh+" the result was: "+r;
                        }
                    }
                }
            }
        };
        Runnable read2 = new Runnable() {
            @SuppressWarnings("synthetic-access")
            public void run() {
                FieldHolder fh = new FieldHolder();
                fh.setFieldB("b");
                for ( int i=0 ; i < numberOfIterations ; i++ ) {
                    fh.setFieldA("a"+i);
                    if (problem == null ) {
                        FieldHolder r= space.take(fh, 19500);
                        if (  r == null ) {
                            problem = "Got null when taking element b"+i;
                        } else if ( !r.getFieldA().equals(fh.getFieldA()) ||
                                !r.getFieldB().equals(fh.getFieldB())) {
                            problem = "Rather disturbing. When querying for "+fh+" the result was: "+r;
                        }
                    }
                }
            }
        };
        Thread a = new Thread( null, write );
        Thread b = new Thread( null, read );
        Thread c = new Thread( null, write2 );
        Thread d = new Thread( null, read2 );

        a.start();
        b.start();
        c.start();
        d.start();
        a.join();
        b.join();
        c.join();
        d.join();
        assertNull(problem, problem );
        FieldHolder fx = new FieldHolder();
        fx.setFieldA("a");
        fx = space.readIfExists(fx);
        assertNull("Should have consumed all of the elements. Still have some: "+fx, fx);
    }

    
    /**
     * Will not fail on insertion time, really. Just testing how many
     * elements that can be inserted and removed. Note that I 
     * <b>do</b> test whether the same number was removed as inserted.
     */
    public void testInsertionTime() {
        NameValueQuery nvq = new NameValueQuery();
        nvq.name = "junit";
        nvq.value = "insertion time";

        log.debug("Started insertion");
        int counter = 0;
        long startTime = System.currentTimeMillis();
        while ( startTime > System.currentTimeMillis() - 1000 ) {
            space.write(nvq, 10000);
            counter++;
        }
        log.debug("Inserted "+counter+" elements");
        int takenCounter = 0;
        while ( space.take( nvq, 200 ) != null ) {
            takenCounter++;
        }
        log.debug("Total running time "+(System.currentTimeMillis() - startTime)+" ms, inserted (and hopefully took) "+counter+" items.");

        assertEquals("Should be able to take as many elements as was inserted.", counter, takenCounter);
    }

}
