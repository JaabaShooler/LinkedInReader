export enum Sender {
  React,
  Content,
}

export interface ChromeMessage {
  from: Sender;
  message: any;
}

export enum EducationType {
  BECHALOR = "bechalor",
  MASTER = "masters",
}

export interface Basic {
  name: string;
  position: string;
  about: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface Experience {
  position: string;
  company: string;
  basis: string;
  start: string;
  end: string;
  location: string;
  description: string;
}

export interface Education {
  name: string;
  type: EducationType.BECHALOR | EducationType.MASTER;
  start: string;
  end: string;
  description: string;
}

export interface Skill {
  title: string;
  endosments: number;
}
