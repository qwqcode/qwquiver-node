import HttpException from './HttpException'

/**
 * 404 Not Found
 */
class NotFoundException extends HttpException {
  // Constructor function
  public constructor(message: string) {
    super(404, {
      error: {
        msg: message
      }
    })
  }
}

export default NotFoundException
