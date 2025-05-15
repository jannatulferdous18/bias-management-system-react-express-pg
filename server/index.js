const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const supabase = require("./supabaseClient.js");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
let biases = [];

app.get("/", (req, res) => {
  res.send("Bias Management Backend is running.");
});

app.post("/login", async (req, res) => {
  const { user_name, password } = req.body;
  try {
    // Query user from custom "users" table with matching username and password
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_name", user_name)
      .eq("password", password)
      .limit(1);

    if (error) {
      console.error("Supabase query error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (!users || users.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = users[0];
    delete user.password;

    return res.json({ success: true, user });
  } catch (err) {
    console.error("Unexpected login error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/register", async (req, res) => {
  const { user_name, password } = req.body;

  if (!user_name || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields required" });
  }

  try {
    // Check if user already exists
    const { data: existingUsers, error: checkError } = await supabase
      .from("users")
      .select("*")
      .eq("user_name", user_name);

    if (checkError) {
      console.error("Error checking user existence:", checkError);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User name already exists, try another name",
      });
    }

    // Insert new user with hashed password
    const { error: insertError } = await supabase.from("users").insert([
      {
        user_name,
        password,
      },
    ]);

    if (insertError) {
      console.error("Error inserting user:", insertError);
      return res
        .status(500)
        .json({ success: false, message: "Failed to register user" });
    }

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.post("/api/biases", async (req, res) => {
  const {
    type, // 'Dataset' or 'Algorithm'
    name,
    domain,
    description,
    biasType,
    biasIdentification,
    severity,
    mitigationStrategies,
    submittedBy,
    version,
    publishedDate,
    size,
    format,
    biasVersionRange,
    technique,
    key_characteristic,
    reference,
  } = req.body;

  // Convert to snake_case for Supabase insert
  const payload = {
    type,
    name,
    domain,
    description,
    bias_type: biasType,
    severity,
    mitigation_strategies: mitigationStrategies,
    submitted_by: submittedBy,
    dataset_algorithm_version: version,
    published_date: publishedDate || null,
    size,
    format,
    bias_version_range: biasVersionRange || null,
    technique,
    bias_identification: biasIdentification || null,
    key_characteristic,
    reference,
  };

  try {
    console.log("Incoming data:", req.body);

    // Check for duplicate
    const { data: duplicates, error: dupError } = await supabase
      .from("biases")
      .select("*")
      .eq("type", type)
      .eq("name", name)
      .eq("description", description)
      .eq("bias_type", biasType);

    if (dupError) throw dupError;

    if (duplicates && duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Bias already exists!",
      });
    }

    // Insert into pending_request table
    const { error: insertError } = await supabase
      .from("pending_request")
      .insert([payload]);

    if (insertError) throw insertError;

    res.status(201).json({
      success: true,
      message: "Bias submitted successfully",
    });
  } catch (err) {
    console.error("Submission error:", err);
    res.status(500).json({
      success: false,
      message: "Submission failed",
      error: err.message,
    });
  }
});

app.post("/api/biases/admin", async (req, res) => {
  const {
    type,
    name,
    domain,
    description,
    biasType,
    biasIdentification,
    severity,
    mitigationStrategies,
    submittedBy, // user_id
    version,
    publishedDate,
    size,
    format,
    biasVersionRange,
    technique,
    key_characteristic,
    reference,
  } = req.body;

  const payload = {
    type,
    name,
    domain,
    description,
    bias_type: biasType,
    severity,
    submitted_by: submittedBy,
    dataset_algorithm_version: version,
    published_date: publishedDate || null,
    size,
    format,
    bias_version_range: biasVersionRange || null,
    technique,
    bias_identification: biasIdentification || null,
    key_characteristic,
    reference,
  };

  try {
    //  Confirm user exists
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("user_id")
      .eq("user_id", submittedBy)
      .maybeSingle();

    if (userError) throw userError;
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    //  Check for duplicate
    const { data: duplicates, error: dupError } = await supabase
      .from("biases")
      .select("*")
      .eq("type", type)
      .eq("name", name)
      .eq("description", description)
      .eq("bias_type", biasType);

    if (dupError) throw dupError;
    if (duplicates && duplicates.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Bias already exists!",
      });
    }

    //  Insert into biases
    const { data: biasInsert, error: biasError } = await supabase
      .from("biases")
      .insert([payload])
      .select("bias_id")
      .single();

    if (biasError) throw biasError;

    const newBiasId = biasInsert.bias_id;

    //  Insert mitigation strategy
    const { data: strategyInsert, error: stratError } = await supabase
      .from("mitigation_strategy")
      .insert([
        { bias_id: newBiasId, strategy_description: mitigationStrategies },
      ])
      .select("mitigation_id")
      .single();

    if (stratError) throw stratError;

    const newMitigationId = strategyInsert.mitigation_id;

    //  Update biases with mitigation_id
    const { error: updateError } = await supabase
      .from("biases")
      .update({ mitigation_id: newMitigationId })
      .eq("bias_id", newBiasId);

    if (updateError) throw updateError;

    //  Insert into dataset_list or model_list
    if (type === "Dataset") {
      const { error: datasetError } = await supabase
        .from("dataset_list")
        .insert([
          {
            bias_id: newBiasId,
            dataset_name: name,
            version,
            domain,
          },
        ]);
      if (datasetError) throw datasetError;
    } else if (type === "Algorithm") {
      const { error: modelError } = await supabase.from("model_list").insert([
        {
          bias_id: newBiasId,
          model_name: name,
          version,
          domain,
        },
      ]);
      if (modelError) throw modelError;
    }

    // Done
    res.status(201).json({
      success: true,
      message: "Bias submitted successfully",
    });
  } catch (err) {
    console.error("Error in /api/biases/admin:", err.stack || err.message);
    res.status(500).json({
      success: false,
      message: "Admin submission failed",
      error: err.message,
    });
  }
});

app.get("/api/biases", async (req, res) => {
  const {
    search = "",
    severity = "",
    biasType = "",
    componentType = "",
  } = req.query;

  try {
    let query = supabase
      .from("biases")
      .select(
        `
        bias_id,
        type,
        name,
        domain,
        description,
        bias_type,
        severity,
        mitigation_strategy:mitigation_strategy!fk_biases_mitigation(strategy_description),
        submitted_by_user:users!fk_biases_submitted_by(user_name),
        dataset_algorithm_version,
        published_date,
        size,
        format,
        bias_version_range,
        technique,
        bias_identification,
        key_characteristic,
        reference,
        created_at
      `
      )

      .order("bias_id", { ascending: false });

    //  Search within base table only
    if (search) {
      query = query.or(
        `
        name.ilike.%${search}%,
        domain.ilike.%${search}%,
        description.ilike.%${search}%,
        bias_type.ilike.%${search}%
        `
      );
    }

    //  Add user name filter separately if needed
    if (search) {
      // You'll need to filter this on the frontend instead
      // Or switch to a Postgres RPC if you want to handle joined search on the DB side
    }

    if (severity) query = query.eq("severity", severity);
    if (biasType) query = query.eq("bias_type", biasType);
    if (componentType) query = query.eq("type", componentType);

    const { data, error } = await query;

    if (error) throw error;

    const formatted = data.map((bias) => ({
      ...bias,
      mitigation_strategy:
        bias.mitigation_strategy?.strategy_description || null,
      submitted_by: bias.submitted_by_user?.user_name || null,
    }));

    res.json({ success: true, biases: formatted });
  } catch (err) {
    console.error("Error in /api/biases:", err);

    res.status(500).json({ success: false, message: "Failed to fetch biases" });
  }
});

app.get("/admin/pending-biases", async (req, res) => {
  try {
    const { data, error } = await supabase.from("pending_request").select(`
        request_id,
        bias_type,
        severity,
        type,
        domain
      `);

    if (error) throw error;

    res.json({ success: true, biases: data });
  } catch (err) {
    console.error("Error fetching pending biases:", err.message);
    res.status(500).json({
      success: false,
      message: "Could not fetch pending biases",
    });
  }
});

app.post("/admin/approve-bias", async (req, res) => {
  const { id } = req.body;

  try {
    // Step 1: Fetch the pending request
    const { data: pending, error: fetchError } = await supabase
      .from("pending_request")
      .select("*")
      .eq("request_id", id)
      .single();

    if (fetchError) throw fetchError;
    if (!pending) {
      return res
        .status(404)
        .json({ success: false, message: "Request not found" });
    }

    const {
      type,
      name,
      domain,
      description,
      bias_type,
      severity,
      submitted_by,
      dataset_algorithm_version,
      published_date,
      size,
      format,
      key_characteristic,
      reference,
      bias_version_range,
      technique,
      bias_identification,
      mitigation_strategies,
    } = pending;

    // Step 2: Insert the bias (without mitigation_id yet)
    const { data: insertedBias, error: insertError } = await supabase
      .from("biases")
      .insert([
        {
          type,
          name,
          domain,
          description,
          bias_type,
          severity,
          submitted_by,
          dataset_algorithm_version,
          published_date,
          size,
          format,
          bias_version_range,
          technique,
          bias_identification,
          key_characteristic,
          reference,
        },
      ])
      .select("bias_id")
      .single();

    if (insertError) throw insertError;
    const bias_id = insertedBias.bias_id;

    // Step 3: Insert mitigation strategy
    const { data: mitigationData, error: mitigationError } = await supabase
      .from("mitigation_strategy")
      .insert([{ bias_id, strategy_description: mitigation_strategies }])
      .select("mitigation_id")
      .single();

    if (mitigationError) throw mitigationError;

    const mitigation_id = mitigationData.mitigation_id;

    // Step 4: Update bias with mitigation_id
    const { error: updateError } = await supabase
      .from("biases")
      .update({ mitigation_id })
      .eq("bias_id", bias_id);

    if (updateError) throw updateError;

    // Step 5: Insert into dataset_list or model_list
    if (type === "Dataset") {
      const { error: dsError } = await supabase.from("dataset_list").insert([
        {
          bias_id,
          dataset_name: name,
          version: dataset_algorithm_version,
          domain,
        },
      ]);
      if (dsError) throw dsError;
    } else if (type === "Algorithm") {
      const { error: modelError } = await supabase.from("model_list").insert([
        {
          bias_id,
          model_name: name,
          version: dataset_algorithm_version,
          domain,
        },
      ]);
      if (modelError) throw modelError;
    }

    // Step 6: Delete from pending_request
    const { error: deleteError } = await supabase
      .from("pending_request")
      .delete()
      .eq("request_id", id);

    if (deleteError) throw deleteError;

    res.json({ success: true, message: "Bias approved and added." });
  } catch (err) {
    console.error("Error approving bias:", err.message || err);
    res.status(500).json({ success: false, message: "Error approving bias." });
  }
});

app.get("/api/bias-types", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("biases")
      .select("bias_type", { count: "exact", head: false });

    if (error) throw error;

    // Get unique bias_type values and sort them
    const types = [...new Set(data.map((row) => row.bias_type))].sort();

    res.json({ success: true, types });
  } catch (err) {
    console.error("Error fetching bias types:", err.message || err);
    res.status(500).json({ success: false, message: "Failed to fetch types" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    // Get all users excluding 'admin'
    const { data: users, error: userError } = await supabase
      .from("users")
      .select("user_id, user_name")
      .neq("user_name", "admin");

    if (userError) throw userError;

    // Count biases per user
    const { data: biases, error: biasError } = await supabase
      .from("biases")
      .select("bias_id, submitted_by");

    if (biasError) throw biasError;

    // Map user_id → submission count
    const countMap = biases.reduce((acc, bias) => {
      acc[bias.submitted_by] = (acc[bias.submitted_by] || 0) + 1;
      return acc;
    }, {});

    const result = users.map((user) => ({
      ...user,
      submission_count: countMap[user.user_id] || 0,
    }));

    res.json({ success: true, users: result });
  } catch (err) {
    console.error("Error fetching users:", err.message || err);
    res.status(500).json({ success: false, message: "Failed to fetch users" });
  }
});

app.put("/admin/biases/:id", async (req, res) => {
  const { id } = req.params;
  const {
    type,
    name,
    domain,
    description,
    bias_type,
    severity,
    mitigation_strategy,
    dataset_algorithm_version,
    published_date,
    size,
    format,
    key_characteristic,
    reference,
    bias_version_range,
    technique,
    bias_identification,
  } = req.body;

  try {
    // Step 1: Update biases table
    const { error: biasError } = await supabase
      .from("biases")
      .update({
        type,
        name,
        domain,
        description,
        bias_type,
        severity,
        dataset_algorithm_version,
        published_date,
        size,
        format,
        bias_version_range,
        technique,
        bias_identification,
        key_characteristic,
        reference,
      })
      .eq("bias_id", id);

    if (biasError) throw biasError;

    // Step 2: Check if mitigation_strategy exists for bias
    const { data: existingMitigation, error: mitigationCheckError } =
      await supabase
        .from("mitigation_strategy")
        .select("mitigation_id")
        .eq("bias_id", id)
        .maybeSingle();

    if (mitigationCheckError) throw mitigationCheckError;

    if (existingMitigation) {
      // Update mitigation strategy
      const { error: updateMitigationError } = await supabase
        .from("mitigation_strategy")
        .update({ strategy_description: mitigation_strategy })
        .eq("bias_id", id);

      if (updateMitigationError) throw updateMitigationError;
    } else {
      // Insert new mitigation strategy and link it
      const { data: newMitigation, error: insertMitigationError } =
        await supabase
          .from("mitigation_strategy")
          .insert([{ bias_id: id, strategy_description: mitigation_strategy }])
          .select("mitigation_id")
          .single();

      if (insertMitigationError) throw insertMitigationError;

      const { error: linkError } = await supabase
        .from("biases")
        .update({ mitigation_id: newMitigation.mitigation_id })
        .eq("bias_id", id);

      if (linkError) throw linkError;
    }

    // Step 3: Update or insert into dataset_list or model_list
    if (type === "Dataset") {
      const { data: datasetExists, error: dsCheckError } = await supabase
        .from("dataset_list")
        .select("bias_id")
        .eq("bias_id", id)
        .maybeSingle();

      if (dsCheckError) throw dsCheckError;

      if (datasetExists) {
        const { error: dsUpdateError } = await supabase
          .from("dataset_list")
          .update({
            dataset_name: name,
            version: dataset_algorithm_version,
            domain,
          })
          .eq("bias_id", id);

        if (dsUpdateError) throw dsUpdateError;
      } else {
        const { error: dsInsertError } = await supabase
          .from("dataset_list")
          .insert([
            {
              bias_id: id,
              dataset_name: name,
              version: dataset_algorithm_version,
              domain,
            },
          ]);

        if (dsInsertError) throw dsInsertError;
      }
    } else if (type === "Algorithm") {
      const { data: modelExists, error: modelCheckError } = await supabase
        .from("model_list")
        .select("bias_id")
        .eq("bias_id", id)
        .maybeSingle();

      if (modelCheckError) throw modelCheckError;

      if (modelExists) {
        const { error: modelUpdateError } = await supabase
          .from("model_list")
          .update({
            model_name: name,
            version: dataset_algorithm_version,
            domain,
          })
          .eq("bias_id", id);

        if (modelUpdateError) throw modelUpdateError;
      } else {
        const { error: modelInsertError } = await supabase
          .from("model_list")
          .insert([
            {
              bias_id: id,
              model_name: name,
              version: dataset_algorithm_version,
              domain,
            },
          ]);

        if (modelInsertError) throw modelInsertError;
      }
    }

    res.json({ success: true, message: "Bias updated successfully." });
  } catch (err) {
    console.error("Error in PUT /admin/biases/:id:", err.message || err);
    res.status(500).json({ success: false, message: "Failed to update bias." });
  }
});

app.delete("/admin/biases/:id", async (req, res) => {
  const biasId = req.params.id;

  try {
    // Step 1: Fetch mitigation_id
    const { data: biasData, error: biasError } = await supabase
      .from("biases")
      .select("mitigation_id")
      .eq("bias_id", biasId)
      .single();

    if (biasError?.code === "PGRST116") {
      return res
        .status(404)
        .json({ success: false, message: "Bias not found" });
    }
    if (biasError) throw biasError;

    const mitigationId = biasData.mitigation_id;

    // Step 2: Delete mitigation strategy if exists
    if (mitigationId) {
      const { error: deleteMitigationError } = await supabase
        .from("mitigation_strategy")
        .delete()
        .eq("mitigation_id", mitigationId);

      if (deleteMitigationError) throw deleteMitigationError;
    }

    // Step 3: Delete the bias
    const { error: deleteBiasError } = await supabase
      .from("biases")
      .delete()
      .eq("bias_id", biasId);

    if (deleteBiasError) throw deleteBiasError;

    res.json({
      success: true,
      message: "Bias and mitigation strategy deleted.",
    });
  } catch (err) {
    console.error("Error deleting bias:", err.message || err);
    res.status(500).json({ success: false, message: "Deletion failed." });
  }
});

app.get("/api/biases/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("biases")
      .select(
        `
        bias_id,
        type,
        name,
        domain,
        description,
        bias_type,
        severity,
        submitted_by,
        dataset_algorithm_version,
        published_date,
        size,
        format,
        key_characteristic,
        bias_version_range,
        technique,
        bias_identification,
        reference,
        created_at,
        mitigation_strategy:mitigation_strategy(strategy_description),
        submitted_by_user:users(user_name)
      `
      )
      .eq("bias_id", id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Bias not found" });
    }

    res.json({
      success: true,
      bias: {
        ...data,
        mitigation_strategies:
          data.mitigation_strategy?.strategy_description || null,
        submitted_by_name: data.submitted_by_user?.user_name || null,
      },
    });
  } catch (err) {
    console.error("Error fetching bias by ID:", err.message || err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/admin/pending-bias/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("pending_request")
      .select(
        `
        request_id,
        bias_type,
        type,
        domain,
        dataset_algorithm_version,
        published_date,
        size,
        format,
        key_characteristic,
        bias_version_range,
        name,
        description,
        severity,
        technique,
        bias_identification,
        mitigation_strategies,
        reference,
        created_at,
        submitted_by_user:users!fk_pending_submitted_by(user_name)
        `
      )

      .eq("request_id", id)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Pending Bias not found",
      });
    }

    res.json({
      success: true,
      bias: {
        ...data,
        submitted_by: data.submitted_by_user?.user_name || null,
      },
    });
  } catch (err) {
    console.error("Error fetching pending bias by ID:", err.message || err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server running");
});
