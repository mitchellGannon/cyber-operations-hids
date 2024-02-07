use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};
use serde::Deserialize;
use std::collections::HashSet;
use std::fs::read_to_string;

#[post("/login")]
async fn login_ids_handler(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

#[derive(Debug, Deserialize)]
struct UserCredentials {
    username: String,
    password: String,
}

fn read_lines(filename: &str) -> HashSet<String> {
    let mut result = HashSet::new();

    for line in read_to_string(filename).unwrap().lines() {
        result.insert(line.to_string());
    }

    return result;
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // read from the file and parse the elements into a file
    let wordlist = read_lines("C:\\Users\\mgannon\\Documents\\Old-laptop\\MitchellGannonPersonal\\masters\\cyber-operations\\final-assignment\\cyber-operations-hids\\intrusion-detection-system\\dev\\wordlist.txt");

    // create a function to check if the request contains an entry from
    // the wordlist

    //HttpServer::new(|| App::new().service(login_ids_handler))
    HttpServer::new(|| {
        App::new().route(
            "/login",
            web::post().to(|credentials: web::Json<UserCredentials>| {
                println!("{:?}", credentials);
                return HttpResponse::Ok();
            }),
        )
    })
    .bind(("127.0.0.1", 6000))?
    .run()
    .await
}
