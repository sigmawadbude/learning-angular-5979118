import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class IdTransformInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse) {
          // Transform the response body if it contains an array of products
          if (Array.isArray(event.body)) {
            const transformedBody = event.body.map(item => {
              if (item._id) {
                return { ...item, id: item._id, _id: undefined }; // Rename _id to id and remove _id
              }
              return item;
            });
            return event.clone({ body: transformedBody });
          }

          // Transform a single product response
          if (event.body && event.body._id) {
            const transformedBody = { ...event.body, id: event.body._id, _id: undefined };
            return event.clone({ body: transformedBody });
          }
        }
        return event;
      })
    );
  }
}
