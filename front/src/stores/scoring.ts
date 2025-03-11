import { makeAutoObservable } from "mobx";
import { TPresentation } from "src/api/puskaStrashnaya/types";

export class PuskaStrashnayaStore {
  isAuth: boolean | undefined = true;
  data: TPresentation | undefined;
  presentations: { id: string; name: string }[] = [];
  slideNumber: number = 1;
  activeElement: string | undefined;

  constructor() {
    makeAutoObservable(this);
  }

  public clearStore = (): void => {
    this.setIsAuth(false);
    this.setActiveElement();
    this.setPresentations();
    this.setSlideNumber(1);
  };

  public setIsAuth = (value?: boolean): void => {
    this.isAuth = value;
  };

  public setDataEasy = (value: TPresentation): void => {
    this.data = value;
  };

  public setData = (value?: TPresentation): void => {
    if (typeof value === "undefined") {
      this.data = undefined;
      this.setActiveElement();
      this.setSlideNumber(1);
    } else {
      const tempData = value;
      tempData.slides.forEach((slide, sIndex) =>
        slide.components.forEach((comp, cIndex) => {
          if (!comp.top && comp.type === "title") {
            tempData.slides[sIndex].components[cIndex].top = 10;
          }
          if (!comp.top && (comp.type === "text" || comp.type === "list")) {
            tempData.slides[sIndex].components[cIndex].top = 100;
          }
          if (!comp.top && comp.type === "image") {
            tempData.slides[sIndex].components[cIndex].top = 300;
          }
          if (!comp.left && comp.type === "title") {
            tempData.slides[sIndex].components[cIndex].left = 200;
          }
          if (!comp.left && (comp.type === "text" || comp.type === "list")) {
            tempData.slides[sIndex].components[cIndex].left = 10;
          }
          if (!comp.left && comp.type === "image") {
            tempData.slides[sIndex].components[cIndex].left = 10;
          }
        })
      );
      this.data = tempData;
      this.setActiveElement();
      this.setSlideNumber(1);
    }
  };

  public setSlideNumber = (value: number): void => {
    this.slideNumber = value;
  };

  public setActiveElement = (value?: string): void => {
    if (typeof value === "undefined") {
      this.activeElement = undefined;
    } else {
      this.activeElement = value;
    }
  };

  public setPresentations = (value?: { id: string; name: string }[]): void => {
    if (typeof value === "undefined") {
      this.presentations = [];
    } else {
      this.presentations = value;
    }
  };
}
