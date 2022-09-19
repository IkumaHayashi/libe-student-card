export type BaseImageType =
  | "base_beside_jump"
  | "base_beside_finger"
  | "base_opposite_jump"
  | "base_opposite_finger";
export const baseImageTypeValues: BaseImageType[] = [
  "base_opposite_finger",
  "base_opposite_jump",
  "base_beside_finger",
  "base_beside_jump",
];
export class BaseImage {
  type: BaseImageType;
  image: HTMLImageElement;
  canvasWidth: number;
  constructor(type: BaseImageType, canvasWidth: number) {
    this.type = type;
    this.image = new Image();
    this.canvasWidth = canvasWidth;
  }
  get name() {
    return "ハガキ・" + this.type.includes("opposite")
      ? "縦"
      : "横" + "・" + this.type.includes("jump")
      ? "ジャンプ"
      : "指出し" + "学長";
  }
  get fileName() {
    return this.type + ".png";
  }
  async getFilePath() {
    switch (this.type) {
      case "base_beside_finger":
        return (await import("../assets/base_beside_finger.png")).default;
      case "base_beside_jump":
        return (await import("../assets/base_beside_jump.png")).default;
      case "base_opposite_finger":
        return (await import("../assets/base_opposite_finger.png")).default;
      case "base_opposite_jump":
        return (await import("../assets/base_opposite_jump.png")).default;
    }
  }

  get ratio() {
    return this.canvasWidth / this.sizes.width;
  }

  async readImage() {
    this.image.src = await this.getFilePath();
    this.image.width = this.sizes.width * this.ratio;
    this.image.height = this.sizes.height * this.ratio;
    return new Promise<void>((resolve, reject) => {
      this.image.onload = () => {
        resolve();
      };
      this.image.onerror = () => reject();
    });
  }
  get sizes() {
    switch (this.type) {
      case "base_beside_finger":
      case "base_beside_jump":
        return {
          width: 2041,
          height: 1379,
          qrStart: {
            x: 1723,
            y: 1060,
          },
          qrEnd: {
            x: 1969,
            y: 1307,
          },
          iconCenter: {
            x: 450,
            y: 780,
          },
          iconWidth: 770,
          nameStart: {
            x: 1080,
            y: 500,
          },
          nameEnd: {
            x: 1950,
            y: 650,
          },
          majorStart: {
            x: 1080,
            y: 840,
          },
          majorEnd: {
            x: 1950,
            y: 940,
          },
        };
      case "base_opposite_finger":
      case "base_opposite_jump":
        return {
          width: 1379,
          height: 2041,
          qrStart: {
            x: 1060,
            y: 1723,
          },
          qrEnd: {
            x: 1307,
            y: 1969,
          },
          iconCenter: {
            x: 700,
            y: 700,
          },
          iconWidth: 770,
          nameStart: {
            x: 270,
            y: 1190,
          },
          nameEnd: {
            x: 1300,
            y: 1350,
          },
          majorStart: {
            x: 270,
            y: 1450,
          },
          majorEnd: {
            x: 1300,
            y: 1550,
          },
        };
    }
  }
}
