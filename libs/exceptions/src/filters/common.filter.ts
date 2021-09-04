import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { APP_CONTEXT } from '@app/constants';
import { isValidException } from '@app/exceptions/helpers/filters.helpers';

@Catch()
export class CommonFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const contextType = host.getType();

    if (contextType === APP_CONTEXT.HTTP) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();
      const hasBeenSent = this.sendResponseIfValidInstance(exception, response);

      if (!hasBeenSent) {
        this.sendDefaultResponse(response);
      }
    }
  }

  private sendResponseIfValidInstance(exception: any, response: any) {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const validStatus = status >= 400 && status < 500;

      if (validStatus) {
        const errors = isValidException(exception)
          ? (exception as any).details
          : { field: '', message: exception.message };

        response.status(status).json({ status, errors });
        return true;
      }

      return false;
    }
  }

  private sendDefaultResponse(response: any) {
    response.status(500).json({ status: 500, errors: 'Interval Server Error' });
  }
}
