Page({
  data : {
      cities : [
        {
          "zip": "010",
          "pinyin": "Beijing",
          "code": "110000",
          "name": "北京",
          "label": "北京Beijing010"
        }, {
          "zip": "023",
          "pinyin": "Chongqing",
          "code": "500000",
          "name": "重庆",
          "label": "重庆Chongqing023"
        }, {
          "zip": "021",
          "pinyin": "Shanghai",
          "code": "310000",
          "name": "上海",
          "label": "上海Shanghai021"
        }, {
          "zip": "022",
          "pinyin": "Tianjin",
          "code": "120000",
          "name": "天津",
          "label": "天津Tianjin022"
        }, {
          "zip": "0431",
          "pinyin": "Changchun",
          "code": "220100",
          "name": "长春",
          "label": "长春Changchun0431"
        }, {
          "zip": "0731",
          "pinyin": "Changsha",
          "code": "430100",
          "name": "长沙",
          "label": "长沙Changsha0731"
        },
      ],
  },
  onChange(event){
      console.log(event.detail,'click right menu callback data')
  },
  aa(e){
    console.log(e.currentTarget.dataset.name)
  },
  onReady(){
      let storeCity = new Array(26);
      const words = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
      words.forEach((item,index)=>{
        storeCity[index] = {
          key : item,
          list : []
        }
      })
      this.data.cities.forEach((item)=>{
        let firstName = item.pinyin.substring(0,1);
        let index = words.indexOf( firstName );
        storeCity[index].list.push({
          name : item.name,
          key : firstName
        });
      })
      this.data.cities = storeCity;
      console.log(this.data.cities)
      this.setData({
        cities : this.data.cities
      })
  }
});