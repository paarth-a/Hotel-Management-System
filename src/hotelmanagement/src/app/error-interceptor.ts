import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse
  } from "@angular/common/http";
  import { catchError } from "rxjs/operators";
  import { throwError } from "rxjs";
  import { Injectable } from "@angular/core";
  import { MatDialog } from "@angular/material/dialog";
  import { ErrorComponent } from "./error/error.component";
  
  @Injectable()
  export class ErrorInterceptor implements HttpInterceptor {
    constructor(private dialog: MatDialog) {}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
      return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = "We were unable to complete that action. Please try again.";

          // show db errors for admin
          if (!document.cookie) errorMessage = "Invalid credentials. Please try again."
          else if (error.message && document.cookie.split(';')[1].trim() === 'is_user=n') errorMessage = error.message;
          this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
          return throwError(error);
        })
      );
    }
  }
  