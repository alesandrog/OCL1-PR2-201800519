package main

import (
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/", fs)

	log.Println("Listening on :2000...")
	err := http.ListenAndServe(":2000", nil)
	if err != nil {
		log.Fatal(err)
	}
}
