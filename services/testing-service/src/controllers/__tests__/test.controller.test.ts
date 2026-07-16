import { publicEndpoint, authenticatedEndpoint, adminOnlyEndpoint, staffAndAdminEndpoint } from '../test.controller.js';

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockImplementation((result) => {
    res.body = result;
    return res;
  });
  return res;
};

const mockRequest = (user = { sub: 'mock-user', role: 'User' }) => ({
  user,
});

describe('Testing Controller', () => {
  let res: any;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  it('publicEndpoint should return a public message', async () => {
    const req = {};
    await publicEndpoint(req as any, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'This is a public endpoint accessible by anyone.',
    }));
  });

  it('authenticatedEndpoint should return authenticated message and user', async () => {
    const user = { sub: 'user123', email: 'user@test.com', role: 'User' };
    const req = mockRequest(user);
    await authenticatedEndpoint(req as any, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'This is an authenticated endpoint.',
      user: user,
    }));
  });

  it('adminOnlyEndpoint should return admin message and user', async () => {
    const user = { sub: 'admin123', role: 'Admin' };
    const req = mockRequest(user);
    await adminOnlyEndpoint(req as any, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'This endpoint is restricted to admins only.',
      user: user,
    }));
  });

  it('staffAndAdminEndpoint should return staff/admin message and user', async () => {
    const user = { sub: 'staff123', role: 'Staff' };
    const req = mockRequest(user);
    await staffAndAdminEndpoint(req as any, res);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'This endpoint is accessible by admins and staff.',
      user: user,
    }));
  });
});
