// ------------------------------------------------------------------------------
//  Copyright (c) Microsoft Corporation.  All Rights Reserved.  Licensed under the MIT License.  See License in the project root for license information.
// ------------------------------------------------------------------------------

import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { AuthenticationStatus } from "./base";
import { GraphExplorerComponent } from "./GraphExplorerComponent";
import { AppComponent } from "./app.component";
import { ScopesDialogComponent } from "./scopes-dialog.component";
import { localLogout } from "./auth";

@Component({
  selector: 'authentication',
  styles: [`
      #ms-signin-button {
          max-width: 215px;
          margin: 20px 0 0px 0px;
          cursor: pointer;
          display: inline-block;
      }

      #signout {
        float: right;
        padding-right: 16px;
        color: #00bcf2;
      }

      #userDisplayName {
          color: #e2e2e2
      }

      #userMail {
          color: #a0a0a0;
      }

      #authenticating-progress-bar {
          margin: 0px auto;
      }

      .noPicture .ms-Persona-details {
          padding-left: 0px;
      }

      #ms-signin-button-holder {
          position: absolute;
          left: 0px;
          width: 100%;
          text-align: center;
      }

      #manage-permissions {
          float: left;
          color: #00bcf2;
      }

      #signout, #manage-permissions {
          margin-top: 9px;
      }
`],
  template: `
    <div *ngIf="getAuthenticationStatus() == 'anonymous'">
        <div tabindex="-1">{{getStr('Using demo tenant')}}</div>
        <div tabindex="-1">{{getStr('To access your own data:')}}</div>
        <div id="ms-signin-button-holder">
            <img id="ms-signin-button" alt="{{getStr('sign in')}}" src="{{getAssetPath('assets/images/MSSignInButton.svg')}}" (click)="login()"/>
        </div>
    </div>
    <div *ngIf="getAuthenticationStatus() == 'authenticating'">
        <div class="c-progress f-indeterminate-local f-progress-small" id="authenticating-progress-bar" role="progressbar" aria-valuetext="Loading..." tabindex="0" aria-label="indeterminate local small progress bar">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
    <div *ngIf="getAuthenticationStatus() == 'authenticated'" id="persona-holder">
         <div class="ms-Persona" [ngClass]="{noPicture: !authInfo.user.profileImageUrl}">
             <div class="ms-Persona-imageArea" *ngIf="authInfo.user.profileImageUrl">
                 <img class="ms-Persona-image" [src]="sanitize(authInfo.user.profileImageUrl)">
             </div>
             <div class="ms-Persona-details">
                 <div class="ms-Persona-primaryText" id='userDisplayName' *ngIf="authInfo.user.displayName">{{authInfo.user.displayName}}</div>
                 <div class="ms-Persona-secondaryText" id='userMail' *ngIf="authInfo.user.emailAddress">{{authInfo.user.emailAddress}}</div>
             </div>
         </div>
         <a href="#" id="signout" class="c-hyperlink" tabindex=0 (click)="logout()">{{getStr('sign out')}}</a>
         <a href="#" id="manage-permissions" class="c-hyperlink" tabindex=0 (click)="manageScopes()">{{getStr('modify permissions')}}</a>
        
     </div>
     `,
})
export class AuthenticationComponent extends GraphExplorerComponent {
    constructor(private sanitizer: DomSanitizer) {
        super();
    }

    sanitize(url:string):SafeUrl {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

  // https://docs.microsoft.com/en-us/azure/active-directory/active-directory-v2-protocols-implicit
  login() {
      let loginProperties = {
        display: 'page',
        response_type: "id_token token",
        response_mode: "fragment",
        nonce: 'graph_explorer',
        prompt: 'select_account',
        mkt: AppComponent.Options.Language,
        scope: AppComponent.Options.DefaultUserScopes
      }

      hello('msft').login(loginProperties);
  };

  logout() {
    localLogout();
  }

  authInfo = this.explorerValues.authentication;

  getAuthenticationStatus() {
      return this.explorerValues.authentication.status;
  }

  manageScopes() {
    ScopesDialogComponent.showDialog();
  }
}