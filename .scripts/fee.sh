d_foo=default
echo "enter foo [$d_foo]"
read foo
foo=${foo:-$d_foo}

echo you typed:

echo $foo