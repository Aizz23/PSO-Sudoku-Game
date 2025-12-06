/**
 * Integration Tests for API Endpoints
 * Tests HTTP endpoints with actual server instance
 */

const request = require('supertest');
const app = require('../server');

describe('API Integration Tests', () => {
  // =====================================
  // HEALTH CHECK
  // =====================================
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const res = await request(app).get('/health');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'OK');
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('timestamp');
    });

    it('should have valid timestamp', async () => {
      const res = await request(app).get('/health');

      const timestamp = new Date(res.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).toBeLessThanOrEqual(Date.now());
    });
  });

  // =====================================
  // PUZZLE GENERATION
  // =====================================
  describe('GET /api/puzzles/generate', () => {
    it('should generate puzzle with default difficulty', async () => {
      const res = await request(app).get('/api/puzzles/generate');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('puzzle');
      expect(res.body.data).toHaveProperty('solution');
      expect(res.body.data).toHaveProperty('difficulty');
    });

    it('should generate easy puzzle', async () => {
      const res = await request(app)
        .get('/api/puzzles/generate')
        .query({ difficulty: 'easy' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.difficulty).toBe('easy');
    });

    it('should generate medium puzzle', async () => {
      const res = await request(app)
        .get('/api/puzzles/generate')
        .query({ difficulty: 'medium' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.difficulty).toBe('medium');
    });

    it('should generate hard puzzle', async () => {
      const res = await request(app)
        .get('/api/puzzles/generate')
        .query({ difficulty: 'hard' });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.difficulty).toBe('hard');
    });

    it('should return 400 for invalid difficulty', async () => {
      const res = await request(app)
        .get('/api/puzzles/generate')
        .query({ difficulty: 'impossible' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid difficulty');
    });

    it('should generate valid 9x9 puzzle', async () => {
      const res = await request(app).get('/api/puzzles/generate');

      const { puzzle, solution } = res.body.data;

      expect(puzzle).toHaveLength(9);
      expect(solution).toHaveLength(9);

      puzzle.forEach((row) => expect(row).toHaveLength(9));
      solution.forEach((row) => expect(row).toHaveLength(9));
    });

    it('should have some empty cells in puzzle', async () => {
      const res = await request(app).get('/api/puzzles/generate');

      const { puzzle } = res.body.data;
      // API returns string format, check for "-" or "0" or 0
      const emptyCount = puzzle
        .flat()
        .filter((cell) => cell === 0 || cell === '-' || cell === '0').length;

      expect(emptyCount).toBeGreaterThan(0);
    });
  });

  // =====================================
  // PUZZLE VALIDATION
  // =====================================
  describe('POST /api/puzzles/validate', () => {
    let validBoard;

    beforeEach(async () => {
      // Generate a puzzle and use its solution as valid board
      const res = await request(app).get('/api/puzzles/generate');
      validBoard = res.body.data.solution;
    });

    it('should validate correct solution', async () => {
      const res = await request(app)
        .post('/api/puzzles/validate')
        .send({ board: validBoard });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isValid).toBe(true);
    });

    it('should reject incomplete board', async () => {
      const incompleteBoard = Array(9)
        .fill(null)
        .map(() => Array(9).fill(0));

      const res = await request(app)
        .post('/api/puzzles/validate')
        .send({ board: incompleteBoard });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.isValid).toBe(false);
    });

    it('should return 400 for missing board', async () => {
      const res = await request(app).post('/api/puzzles/validate').send({});

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid board format', async () => {
      const res = await request(app)
        .post('/api/puzzles/validate')
        .send({ board: [1, 2, 3] }); // Not 9x9

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid board format');
    });

    it('should reject board with duplicates', async () => {
      const invalidBoard = [...validBoard];
      invalidBoard[0][0] = invalidBoard[0][1]; // Create duplicate

      const res = await request(app)
        .post('/api/puzzles/validate')
        .send({ board: invalidBoard });

      expect(res.statusCode).toBe(200);
      expect(res.body.data.isValid).toBe(false);
    });
  });

  // =====================================
  // PUZZLE HINTS
  // =====================================
  describe('POST /api/puzzles/hint', () => {
    let puzzleData;

    beforeEach(async () => {
      const res = await request(app).get('/api/puzzles/generate');
      puzzleData = res.body.data;
    });

    it('should provide hint for puzzle', async () => {
      const res = await request(app).post('/api/puzzles/hint').send({
        puzzle: puzzleData.puzzle,
        solution: puzzleData.solution,
      });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('row');
      expect(res.body.data).toHaveProperty('col');
      expect(res.body.data).toHaveProperty('value');
    });

    it('should return valid coordinates', async () => {
      const res = await request(app).post('/api/puzzles/hint').send({
        puzzle: puzzleData.puzzle,
        solution: puzzleData.solution,
      });

      const { row, col } = res.body.data;

      expect(row).toBeGreaterThanOrEqual(0);
      expect(row).toBeLessThan(9);
      expect(col).toBeGreaterThanOrEqual(0);
      expect(col).toBeLessThan(9);
    });

    it('should provide hint for empty cell', async () => {
      const res = await request(app).post('/api/puzzles/hint').send({
        puzzle: puzzleData.puzzle,
        solution: puzzleData.solution,
      });

      const { row, col } = res.body.data;

      // The hinted cell should be empty in the puzzle (can be 0, "-", or "0")
      const cellValue = puzzleData.puzzle[row][col];
      expect([0, '-', '0']).toContain(cellValue);
    });
  });

  // =====================================
  // 404 HANDLER
  // =====================================
  describe('404 Not Found', () => {
    it('should return 404 for non-existent route', async () => {
      const res = await request(app).get('/api/non-existent-route');

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('not found');
    });
  });

  // =====================================
  // CORS
  // =====================================
  describe('CORS Headers', () => {
    it('should have CORS headers', async () => {
      const res = await request(app)
        .get('/health')
        .set('Origin', 'http://localhost:3000');

      expect(res.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  // =====================================
  // ERROR HANDLING
  // =====================================
  describe('Error Handling', () => {
    it('should handle malformed JSON', async () => {
      const res = await request(app)
        .post('/api/puzzles/validate')
        .set('Content-Type', 'application/json')
        .send('{"invalid": json}');

      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  });

  // =====================================
  // PERFORMANCE
  // =====================================
  describe('Performance Tests', () => {
    it('should generate puzzle in reasonable time', async () => {
      const start = Date.now();

      await request(app).get('/api/puzzles/generate');

      const duration = Date.now() - start;
      expect(duration).toBeLessThan(3000); // 3 seconds
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(5)
        .fill(null)
        .map(() => request(app).get('/api/puzzles/generate'));

      const results = await Promise.all(requests);

      results.forEach((res) => {
        expect(res.statusCode).toBe(200);
      });
    });
  });
});
