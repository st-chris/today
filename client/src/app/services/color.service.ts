import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  private colors: string[] = [
    '#fecb02',
    '#ff5503',
    '#b084e6',
    '#02c8f5',
    '#febc82',
    '#51e4f4',
  ];

  public getRandomColor(lastUsedColor: string | undefined): string {
    // create temporary color list without last used color
    const tempColors = lastUsedColor ? this.colors.filter((el) => el !== lastUsedColor) : this.colors;
    // random color index based on temporary list length
    const randomIdx = Math.floor(Math.random() * (tempColors.length - 1));

    return tempColors[randomIdx];
  }
}
