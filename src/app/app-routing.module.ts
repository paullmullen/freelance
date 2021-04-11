import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { CanLoad, PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'bam',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'dismiss-bam',
    loadChildren: () => import('./dismiss-bam/dismiss-bam.module').then( m => m.DismissBamPageModule),
    canLoad: [AuthGuard]
  },
  // {
  //   path: 'chatbot',
  //   loadChildren: () => import('./chatbot/chatbot.module').then( m => m.ChatbotPageModule)
  // },
  {
    path: 'my-stuff',
    loadChildren: () => import('./my-stuff/my-stuff.module').then( m => m.MyStuffPageModule),
    canLoad: [AuthGuard]

  },
  {
    path: 'auth',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registration',
    loadChildren: () => import('./registration/registration.module').then( m => m.RegistrationPageModule)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./verify-email/verify-email.module').then( m => m.VerifyEmailPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signout',
    loadChildren: () => import('./signout/signout.module').then( m => m.SignoutPageModule)
  },
  {
    path: 'bam',
    loadChildren: () => import('./bam/bam.module').then( m => m.BamPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
