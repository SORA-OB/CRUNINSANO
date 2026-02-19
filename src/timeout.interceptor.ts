import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000), // Tiempo límite de 5 segundos
      catchError((err) => {
        if (err instanceof TimeoutError) {
          // Si el tiempo se agota, lanzamos una excepción de NestJS
          return throwError(() => new RequestTimeoutException('La petición ha tardado demasiado tiempo.'));
        }
        return throwError(() => err);
      }),
    );
  }
}