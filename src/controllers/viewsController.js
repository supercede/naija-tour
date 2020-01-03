const viewsController = {};

viewsController.getOverview = (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours'
  });
};

viewsController.getTour = (req, res) => {
  res.status(200).render('tour', {
    title: 'The Eastern Adventurer'
  });
};

export default viewsController;
