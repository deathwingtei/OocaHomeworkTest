const request = require('supertest');
const app = require('../app');

describe('Shop Controller Test', () => {

  it('should return 200 with member card data when found', async () => {
    const req = {
      body: {
        member: 'A1111'
      },
    };
    const res = await request(app).post('/shop/member').send(req.body);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data).toEqual({
      code: 'A1111',
      name: 'Discount 10% Member Card',
      discount_type: 'Percentage',
      id:1,
      discount: '10'
    });
  });

  it('should return 404 when member card not found', async () => {
    const req = { body: { member: '99999' } };
    const res = await request(app).post('/shop/member').send(req.body);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe(404);
    expect(res.body.error).toBe('Member card not found');
  });

  it('should return successful checkout with member card and double promotion', async () => {
    const req = {
      body: {
        cart: [
          { id: 2, quantity: 2 },
        ],
        member: 'A1111',
      },
    };
    const res = await request(app).post('/shop/checkout').send(req.body);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data).toBeCloseTo(68.4);
  });

  it('should return successful checkout with member card but no double promotion', async () => {
    const req = {
      body: {
        cart: [
          { id: 2, quantity: 1 },
        ],
        member: 'A1111',
      },
    };
    const res = await request(app).post('/shop/checkout').send(req.body);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data).toBeCloseTo(36);
  });

  it('should return successful checkout with no member card but double promotion', async () => {
    const req = {
      body: {
        cart: [
          { id: 2, quantity: 2 },
        ],
        member: '',
      },
    };
    const res = await request(app).post('/shop/checkout').send(req.body);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data).toBeCloseTo(76);
  });

  it('should return successful checkout with no member card and no double promotion', async () => {
    const req = {
      body: {
        cart: [
          { id: 2, quantity: 1 },
        ],
        member: '',
      },
    };
    const res = await request(app).post('/shop/checkout').send(req.body);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe(200);
    expect(res.body.data).toBeCloseTo(40);
  });
 
  it('should return error when cart is empty', async () => {
    const req = {
      body: {
        cart: [],
        member: '12345',
      },
    };
    const res = await request(app).post('/shop/checkout').send(req.body);
    expect(res.status).toBe(500);
    expect(res.body.status).toBe(500);
    expect(res.body.error).toBe('Cart is empty');
  });
});