import HttpException from "./http";

class NotFoundException extends HttpException {
  constructor() {
    super(404, `Not found`);
  }
}

export default NotFoundException;
