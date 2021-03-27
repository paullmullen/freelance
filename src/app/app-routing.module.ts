import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { CanLoad, PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'folder/Bam',
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
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
