export const getChatPage = async (req, res) => {
    try{
        const user = req.session.user;
        res.render("chat", user);
    } catch (error) {
        req.logger.error(error);
    
        res.send({
          success: false,
          error,
        });
    }
}