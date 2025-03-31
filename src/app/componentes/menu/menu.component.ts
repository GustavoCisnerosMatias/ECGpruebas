import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IMenu } from 'src/app/interfaces/interface';
import { SerAutentificacionService } from 'src/app/servicios/ser-autentificacion.service';
import { GeneralService } from 'src/app/servicios/general.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  menu: IMenu[] = [];

  constructor(
    private serM: SerAutentificacionService,
    private router: Router,
    public serG: GeneralService
  ) {}



  ngOnInit() {
    // Filtra el menú para mostrar solo los elementos con categoría 0
    this.menu = this.serM.menu.filter(item => item.categoria == 0);
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  navigateTo(url: string) {
    this.router.navigate([url]);
  }
}
