use actix_web::{post, web, App, HttpResponse, HttpServer, Responder};

#[post("/login")]
async fn login_ids_handler(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new().service(login_ids_handler))
        .bind(("127.0.0.1", 6000))?
        .run()
        .await
}
