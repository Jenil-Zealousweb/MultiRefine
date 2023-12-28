import { dbConnect } from "../db/dbConnect.js"

const filterAddList = async (req, res) => {
    try {
        const { user_id, site_id, name, type, layout, collection, date } = req.body;
        if (!user_id || !site_id || !name || !type || !layout || !collection || !date) {
            return res.status(401).json({
                message: 'All fields are required',
                success: false,
            });
        }
        const checkQuery = `SELECT COUNT(*) AS count FROM filter WHERE name = ? AND type = ? AND layout = ?`;
        const checkValues = [name, type, layout];
        dbConnect.query(checkQuery, checkValues, (error, data) => {
            try {
                if (error) {
                    console.log(error);
                    return res.status(404).send({
                        message: "Error in query",
                        success: false,
                    });
                }
                if (data[0].count > 0) {
                    return res.status(200).send({
                        message: 'Filter already exists',
                        success: true,
                        data,
                    });
                }
                const insertQuery = "INSERT INTO filter (user_id, site_id, name, type, layout, collection, date) VALUES (?)";
                const insertValue = [user_id, site_id, name, type, layout, collection, date]
                dbConnect.query(insertQuery, [insertValue], (error, data) => {
                    try {
                        if (error) {
                            console.log(error);
                            return res.status(404).json({
                                message: "Error in query",
                                success: false,
                            });
                        };
                        return res.status(201).send({
                            message: "filter created",
                            success: true,
                            data,
                        });
                    } catch (error) {
                        return res.status(404).json({
                            message: "filter error",
                            success: false,
                        });
                    }
                })
            } catch (error) {
                return res.status(400).send({
                    message: 'Filter allready created, check again',
                    success: false
                })
            }
        });
    } catch (error) {
        return res.status(400).send({
            message: 'Error in filter create, try again',
            success: false,
        });
    }
}

const userFilterList = async (req, res) => {
    try {
        const { userID } = req.body;

        const sqlQuery = `SELECT * FROM filter WHERE user_id = ${userID}`;

        dbConnect.query(sqlQuery, (error, data) => {
            try {
                if (error) {
                    console.log(error);
                    return res.status(404).json({
                        message: "Error in query",
                        success: false,
                    });
                };
                return res.status(200).send({
                    message: "filter list fetch successfully",
                    success: true,
                    data,
                });
            } catch (error) {
                return res.status(404).json({
                    message: "error in filter",
                    success: false,
                });
            }
        })
    } catch (error) {
        return res.status(400).send({
            message: 'Error in filter list, try again',
            success: false,
        });
    }
}

const filterRemove = async (req, res) => {
    try {
        const id = req.params.id;
        const sqlDelete = "DELETE FROM filter WHERE id=?";
        const valueDelete = [[id]];

        dbConnect.query(sqlDelete, valueDelete, function (error, data) {
            if (error) {
                console.log(error);
                return res.status(404).json({
                    message: "Error in query",
                    success: false,
                });
            };

            return res.status(200).send({
                message: "filter deleted",
                success: true,
                data,
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in filter",
            success: false,
        });
    }
}

const userDetails = async (req, res) => {
    try {
        const id = req.params.id;

        const sqlGet = "SELECT * FROM filter WHERE id=?";
        const valueGet = [[id]];

        dbConnect.query(sqlGet, valueGet, function (error, data) {
            if (error) {
                console.log(error);
                return res.status(404).json({
                    message: "Error in query",
                    success: false,
                });
            };

            return res.status(200).send({
                message: "filter fetch",
                success: true,
                data,
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in filter",
            success: false,
        });
    }
}

const filterUpdate = async (req, res) => {
    try {
        const id = req.params.id;

        const { name, type, layout, collection, date } = req.body;

        if (!name || !type || !layout || !collection || !date) {
            return res.status(401).json({
                message: 'All fields are required',
                success: false,
            });
        }

        const checkQuery = `SELECT COUNT(*) AS count FROM filter WHERE name = ? AND type = ? AND layout = ?`;
        const checkValues = [name, type, layout];
        dbConnect.query(checkQuery, checkValues, (error, data) => {
            try {
                if (error) {
                    console.log(error);
                    return res.status(404).send({
                        message: "Error in query",
                        success: false,
                    });
                }
                if (data[0].count > 0) {
                    return res.status(200).send({
                        message: 'Filter already exists',
                        success: true,
                        data,
                    });
                }
                const updateQuery = `UPDATE filter SET name = ?, type = ?, layout = ?, collection = ?, date = ? WHERE id = ${id}`;
                dbConnect.query(updateQuery, [name, type, layout, collection, date], (error, data) => {
                    try {
                        if (error) {
                            console.log(error);
                            return res.status(404).json({
                                message: "Error in query",
                                success: false,
                            });
                        };
                        return res.status(200).send({
                            message: "filter updated",
                            success: true,
                            data,
                        });
                    } catch (error) {
                        return res.status(404).json({
                            message: "filter error",
                            success: false,
                        });
                    }
                })
            } catch (error) {
                return res.status(400).send({
                    message: 'Filter allready created, check again',
                    success: false
                })
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            message: "Error in filter",
            success: false,
        });
    }
}

export { filterAddList, userFilterList, filterRemove, userDetails, filterUpdate };
