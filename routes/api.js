const router = require("express").Router();
const db = require("../models/");

async function executeDbOp(operation, res) {
  try {
    const returnValue = await operation();
    res.json(returnValue);
  } catch (err) {
    res.status(418).json(err);
    console.log(err);
  }
}

router.get("/api/workouts", async (req, res) => {
  await executeDbOp(async () => {
    const workouts = await db.Workout.aggregate([
      {
        $addFields: {
          totalDuration: {
            $sum: "$exercises.duration",
          },
        },
      },
    ]);
    return workouts;
  }, res);
});

router.put("/api/workouts/:id", async (req, res) => {
  await executeDbOp(async () => {
    const exercise = req.body;
    const workoutId = req.params.id;
    await db.Workout.findByIdAndUpdate(workoutId, {
      $addToSet: { exercises: exercise },
    });
    return { ok: true };
  }, res);
});

router.post("/api/workouts", async (req, res) => {
  await executeDbOp(async () => {
    const workout = await db.Workout.create({
      day: new Date(),
      exercises: [],
    });
    return workout;
  }, res);
});
module.exports = router;
