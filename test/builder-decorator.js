var should = require('chai').should(),
    builder_decorator = require('../builder-decorator'),
    BuildDecorator = builder_decorator.BuildDecorator;

describe('#BuildDecorator', function() {
  it('does stuff', function() {
    ('&').should.equal('&');
  });
  
  it('does other stuff', function() {
    ('&').should.equal('^');
  });
});