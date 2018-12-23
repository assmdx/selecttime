package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"io/ioutil"
	"log"
	"net/http"
)


//data
type Ceo struct {
	Ceo string  `json:"ceo,omitempty"`
}
type Data struct {
	CodeBox []int 	`json:"codeBox,omitempty"`
	MaxCode int 	`json:"maxCode,omitempty"`
	CeoList  []Ceo	`json:"ceoList,omitempty"`
}
type Result struct {
	Code int	`json:"code,omitempty"`
}
var data Data
var codeMap = make(map[string]int)


func produceCode() {
	initalData,err := ioutil.ReadFile("./data.json")
	err = json.Unmarshal(initalData, &data)
	if err == nil {

	}
	index :=0
	for index < 81 {
		//fmt.Println(data.CeoList[index].Ceo)
		//fmt.Println(data.CodeBox[index])
		codeMap[data.CeoList[index].Ceo] = data.CodeBox[index]
		index++
	}
}
func GetCode(w http.ResponseWriter, r *http.Request) {
	var req Ceo
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &req)
	//fmt.Println(req.Ceo)

	var res Result
	if codeMap[req.Ceo] == 0 {
		json.NewEncoder(w).Encode(&Result{})
		return
	}
	res.Code =codeMap[req.Ceo]
	//fmt.Println(res)
	//fmt.Println(res.Code)
	json.NewEncoder(w).Encode(res)
}


func main() {
	router := mux.NewRouter()
	produceCode()
	//fmt.Println(data.CeoList[1].Ceo)
	adminRouter := router.PathPrefix("/select").Subrouter()
	adminRouter.HandleFunc("", GetCode)
	adminRouter.HandleFunc("/", GetCode)
	fmt.Println("started at port 22021")
	log.Fatal(http.ListenAndServe(":22021", router))
}
