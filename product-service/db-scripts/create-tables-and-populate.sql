create table if not exists products (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    price int
);
			
create table if not exists stocks (
    product_id uuid,
    count int,
    foreign key ("product_id") references "products" ("id")
);
			
insert into products(title, description, price) values 
    ('Product1', 'description1', 350), 
    ('Product2', 'description2', 100), 
    ('Product3', null, 270), 
    ('Product4', 'description4', 1300), 
    ('Product5', 'description5', 3400), 
    ('Product6', null, 1200);

insert into stocks select id, floor(random() * 100 + 1)::int from products;
