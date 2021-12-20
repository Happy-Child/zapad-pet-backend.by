import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { APP_CONTEXT, ENTITIES_FIELDS, ENVIRONMENTS } from '@app/constants';
import { isValidException } from '@app/exceptions/helpers';
import { NODE_ENV } from 'config';

@Catch()
export class ExceptionsCommonFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const contextType = host.getType();

    if (NODE_ENV === ENVIRONMENTS.PROD) {
      console.log('EXCEPTION', exception);
    }

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
      const validStatusForException =
        status >= HttpStatus.BAD_REQUEST &&
        status < HttpStatus.INTERNAL_SERVER_ERROR;

      if (validStatusForException) {
        const errors = isValidException(exception)
          ? (exception as any).details
          : [{ field: ENTITIES_FIELDS.UNKNOWN, message: exception.message }];

        if (NODE_ENV === ENVIRONMENTS.PROD) {
          console.log('ERRORS', errors);
        }

        response.status(status).json({ errors });

        return true;
      }

      return false;
    }
  }

  private sendDefaultResponse(response: any) {
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      errors: [
        { field: ENTITIES_FIELDS.UNKNOWN, message: 'Interval Server Error' },
      ],
    });
  }
}
