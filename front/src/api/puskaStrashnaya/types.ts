export type TPresentation = {
  id: string;
  background: number;
  name: string;
  slides: TSlide[];
};

export type TSlide = {
  id: string;
  number: number;
  components: TComponent[];
};

export type TComponent = {
  id: string;
  type: string;
  content: string;
  top: number | null;
  left: number | null;
};

export type TPostGenerateRequestData = {
  description: string;
  theme: string;
};

export type TPostGenerateResponse = TPresentation;
