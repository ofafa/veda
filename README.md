# Ayuveda
Ayuveda is a simple, scalable and power Traditional Chinese Medicine(TCM) search engine based on real usage data and traditional Chinese Medicine theories.
Just compose your search as using Google, then you can get the related composition or medicine related to the search terms.
<br/>
![alt tag](https://raw.githubusercontent.com/ofafa/veda/master/public/images/readme/Search_result.jpg)

Ayuveda also provide features for professional users. If you know how to compose the medicines, you can create it easily within the help of typeahead.
<br/>
![alt tag](https://raw.githubusercontent.com/ofafa/veda/master/public/images/readme/Compose_composition.jpg)


Proposed data model:
In the TCM theorem, each medicine has its own property that could effect people's status, while the status of people could be retrieved be several ways, including conversation, watching the tongue, pulse taking and so on.

Within the help of information technology, we could perform the conversation and inference based on the previous data and search query from people to provide better search results.

The inference could be achieved by vertorizing the property of medicines and then get the combination of the vectors to compute the effect of the compos. Then we would be able to improve the search results by matching the search query, user data and our knowledge base.

For example, if one search "cough" + "yello sputum", we could infer that the user is looking for something that can reduce the heat in the breath system, that will lead to some specific compo that can reduce the inflammation and cough. 

We could also further improve the results by collecting the comment from purchased users. That will make our model more precise and reliable, which is never achieved beforesince all the data is not contribute by normal users.