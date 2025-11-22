const addUser = () => {
    // Function implementation
    const { name, email } = req.body;
    // Add user logic here
    res.status(201).send({ message: 'User added successfully' });

    supabase.addUser(`name`, `email`);

}

//const registerUser = asyncHandler( async (req, res) => {....})