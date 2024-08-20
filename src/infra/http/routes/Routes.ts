import { balanceRoute } from "./balance.routes";
import { eventRoute } from "./event.routes";
import { resetRoute } from "./reset.routes";

export class Routes {
    static balanceRoutes = balanceRoute
    static eventRoutes = eventRoute
    static resetRoutes = resetRoute
}