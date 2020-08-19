import { Component, Input, OnInit } from '@angular/core';
import { GIFObject, Images } from 'giphy-api';

@Component({
  selector: 'app-gif-search-result',
  templateUrl: './gif-search-result.component.html',
  styleUrls: ['./gif-search-result.component.scss']
})
export class GifSearchResultComponent implements OnInit {
  @Input() public gif: GIFObject;
  public imageSources: Images['fixed_height']|Images['original'];
  public displayType = 'gif';

  constructor() { }

  ngOnInit(): void {
    this.imageSources = this.gif.images.fixed_height || this.gif.images.original;

    // Show webp if it's a smaller-sized image, based on Giphy's rendition guide
    // https://developers.giphy.com/docs/optional-settings/#rendition-guide
    // TODO: add displayType='mp4' and show it instead of gif/webp if it has the smallest size for this gif
    this.displayType = Number(this.imageSources.webp_size) < Number(this.imageSources.size) ? 'webp' : 'gif';
  }

  goToGifPage(): void {
    this.goToUrl(this.gif.url);
  }

  goToUrl(url) {
    window.location.href = url;
  }

}
