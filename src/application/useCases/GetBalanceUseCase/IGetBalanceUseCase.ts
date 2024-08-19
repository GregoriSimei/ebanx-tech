import { IUseCase } from "../IUseCase";
import { TGetBalanceUseCaseRequest, TGetBalanceUseCaseResponse } from "./TGetBalanceUseCase";

export interface IGetBalanceUseCase extends IUseCase<TGetBalanceUseCaseRequest, TGetBalanceUseCaseResponse> {}