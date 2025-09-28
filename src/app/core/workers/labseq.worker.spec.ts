describe('Labseq Worker (Jasmine)', () => {
  let worker: Worker;

  beforeEach(() => {
    worker = new Worker(new URL('./labseq.worker', import.meta.url), {
      type: 'module'
    });
  });

  afterEach(() => {
    worker.terminate();
  });

  it('should calculate a small value correctly', (done) => {
    worker.onmessage = ({ data }) => {
      expect(data.value).toBeDefined();
      expect(data.tooBig).toBeFalse();
      done();
    };

    worker.postMessage(5);
  });

  it('should flag tooBig for very large input', (done) => {
    worker.onmessage = ({ data }) => {
      expect(data.tooBig).toBeTrue();
      done();
    };

    worker.postMessage(1_000_001);
  });

  it('should handle invalid input gracefully', (done) => {
    worker.onmessage = ({ data }) => {
      expect(data.error).toBeTrue();
      expect(data.message).toContain('Unexpected Error');
      done();
    };

    worker.postMessage(-1);
  });
});
