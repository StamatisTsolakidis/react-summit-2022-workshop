import {ComponentCtaModel} from "../models/ComponentCtaModel";
import {ComponentHeroModel} from "../models/ComponentHeroModel";
import {ComponentTextWithImageModel} from "../models/ComponentTextWithImageModel";

export interface INavComponents{
    data: (ComponentCtaModel | ComponentHeroModel | ComponentTextWithImageModel)[]
}
