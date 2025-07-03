import accessController from "../../controllers/access.controller";

const router = express.Router();

router.post("/api/sign-up", accessController.signUp);

export default router;
