import { IUseCase } from "../IUseCase";
import { TCreateEventUseCaseRequest, TCreateEventUseCaseResponse } from "./TCreateEventUseCase";

export interface ICreateEventUseCase extends IUseCase<TCreateEventUseCaseRequest, TCreateEventUseCaseResponse> {}