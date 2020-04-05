exports.render404 = function(req, res) {
   const firstLine = "0189: No Route Available";
   const errCode = "Are you using the right https method?";
   res.status(404).render("404", { firstLine, errCode });
   console.log(`${firstLine} error<${errCode}>`);
};
