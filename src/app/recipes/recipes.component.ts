import { Component } from '@angular/core';

@Component({
  selector: 'app-recipes-box',
  templateUrl: './recipes.component.html',
})
export class RecipesComponent {
  searchQuery = 'Salad';
  onSearch() {
    console.log(this.searchQuery);
  }
}
