const Reporter = require('jasmine-terminal-reporter');

const reporter = new Reporter({isVerbose: true});

jasmine.getEnv().addReporter(reporter);