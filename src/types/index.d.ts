export interface IPoints {
  topLeft: {
    x: Number;
    y: Number;
  };
  topRight: {
    x: Number;
    y: Number;
  };
  bottomLeft: {
    x: Number;
    y: Number;
  };
  bottomRight: {
    x: Number;
    y: Number;
  };
  height: Number;
  width: Number;
}

export interface CroppedPhotoResponse {
  uri: string;
  height: Number;
  width: Number;
}
