import { createFile, listFiles, getFile, updateFile, deleteFile } from '../file.controller.js';
import File from '../../models/file.model.js';

jest.mock('../../models/file.model.js');

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockImplementation((result) => {
    res.body = result;
    return res;
  });
  return res;
};

const mockRequest = (body = {}, params = {}, user = { sub: 'mock-user-id' }) => ({
  body,
  params,
  user,
});

describe('File Controller', () => {
  let res: any;

  beforeEach(() => {
    res = mockResponse();
    jest.clearAllMocks();
  });

  describe('createFile', () => {
    it('should create a file successfully', async () => {
      const mockFileInstance = {
        save: jest.fn().mockResolvedValue(true),
      };
      (File as any).mockImplementation(() => mockFileInstance);

      const req = mockRequest({ fileName: 'test.txt', content: 'hello' });
      await createFile(req as any, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalled();
    });

    it('should return 400 if fileName is missing', async () => {
      const req = mockRequest({ content: 'hello' });
      await createFile(req as any, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'fileName is required' });
    });

    it('should return 500 on internal server error', async () => {
      (File as any).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('DB Error')),
      }));

      const req = mockRequest({ fileName: 'test.txt' });
      await createFile(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('listFiles', () => {
    it('should list files successfully', async () => {
      const mockFiles = [{ fileName: 'file1.txt' }, { fileName: 'file2.txt' }];
      (File.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          select: jest.fn().mockResolvedValue(mockFiles),
        }),
      });

      const req = mockRequest();
      await listFiles(req as any, res);

      expect(res.json).toHaveBeenCalledWith(mockFiles);
    });

    it('should return 500 on internal server error', async () => {
      (File.find as jest.Mock).mockImplementation(() => { throw new Error('DB Error'); });

      const req = mockRequest();
      await listFiles(req as any, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getFile', () => {
    it('should get a file successfully', async () => {
      const mockFile = { _id: 'file-id', fileName: 'test.txt' };
      (File.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockFile),
      });

      const req = mockRequest({}, { id: 'file-id' });
      await getFile(req as any, res);

      expect(res.json).toHaveBeenCalledWith(mockFile);
    });

    it('should return 404 if file not found', async () => {
      (File.findOne as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const req = mockRequest({}, { id: 'none' });
      await getFile(req as any, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'File not found' });
    });
  });

  describe('updateFile', () => {
    it('should update a file successfully', async () => {
      const mockFile = { _id: 'file-id', fileName: 'updated.txt' };
      (File.findOneAndUpdate as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(mockFile),
      });

      const req = mockRequest({ fileName: 'updated.txt' }, { id: 'file-id' });
      await updateFile(req as any, res);

      expect(res.json).toHaveBeenCalledWith(mockFile);
    });

    it('should return 400 if nothing to update', async () => {
      const req = mockRequest({}, { id: 'file-id' });
      await updateFile(req as any, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Nothing to update' });
    });

    it('should return 404 if file not found', async () => {
      (File.findOneAndUpdate as jest.Mock).mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      const req = mockRequest({ fileName: 'updated.txt' }, { id: 'none' });
      await updateFile(req as any, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'File not found' });
    });
  });

  describe('deleteFile', () => {
    it('should delete a file successfully', async () => {
      (File.findOneAndDelete as jest.Mock).mockResolvedValue({ _id: 'file-id' });

      const req = mockRequest({}, { id: 'file-id' });
      await deleteFile(req as any, res);

      expect(res.json).toHaveBeenCalledWith({ message: 'File deleted successfully' });
    });

    it('should return 404 if file not found', async () => {
      (File.findOneAndDelete as jest.Mock).mockResolvedValue(null);

      const req = mockRequest({}, { id: 'none' });
      await deleteFile(req as any, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'File not found' });
    });
  });
});
