export const getChatPage = async (req, res) => {
    try{
        const user = req.session.user;
        res.render("chat", user);
    } catch (error) {
        console.log(error);
    
        res.send({
          succes: false,
          error,
        });
    }
}