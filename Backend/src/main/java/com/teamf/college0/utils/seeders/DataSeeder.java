package com.teamf.college0.utils.seeders;

import com.teamf.college0.domain.user.account.UserAccountRepository;
import com.teamf.college0.domain.user.account.entity.UserAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile({"first_run"})
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserAccountRepository accountRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        System.out.println("Starting Data Seeding!");

        try {
            seedRegistrar("registrar1", "Karol", "Kopciuch");
            seedRegistrar("registrar2", "Marcus", "Coppa");
            seedRegistrar("registrar3", "Momoka", "Yonashiro");
        } catch (Exception e) {
            System.out.println("NOT REPEATING REGISTRARS: " + e.getMessage());
        }

        try {
            seedInstructor("instructor1", "Alice", "Johnson");
            seedInstructor("instructor2", "Bob", "Smith");
            seedInstructor("instructor3", "Carol", "Williams");
        } catch (Exception e) {
            System.out.println("NOT REPEATING INSTRUCTORS: " + e.getMessage());
        }

        try {
            seedStudent("helloworld", "Tyler", "Bash");
            seedStudent("flame", "Chris", "Kyle");
        } catch (Exception e) {
            System.out.println("NOT REPEATING STUDENTS: " + e.getMessage());
        }

        System.out.println("Completed Data Seeding!");
    }

    private void seedRegistrar(String userName, String firstName, String lastName) {
        UserAccount registrar = new UserAccount();
        registrar.setUserName(userName);
        registrar.setRole(UserAccount.Role.REGISTRAR);
        registrar.setPassword(passwordEncoder.encode("test123"));
        registrar.setFirstName(firstName);
        registrar.setLastName(lastName);
        registrar.setMember(true);
        registrar.setStatus(UserAccount.Status.APPROVED);
        accountRepository.save(registrar);
    }

    private void seedInstructor(String userName, String firstName, String lastName) {
        UserAccount instructor = new UserAccount();
        instructor.setUserName(userName);
        instructor.setRole(UserAccount.Role.INSTRUCTOR);
        instructor.setPassword(passwordEncoder.encode("test123"));
        instructor.setFirstName(firstName);
        instructor.setLastName(lastName);
        instructor.setMember(true);
        instructor.setStatus(UserAccount.Status.APPROVED);
        accountRepository.save(instructor);
    }

    private void seedStudent(String userName, String firstName, String lastName) {
        UserAccount student = new UserAccount();
        student.setUserName(userName);
        student.setPassword(passwordEncoder.encode("test123")); // fixed: was plain text
        student.setRole(UserAccount.Role.STUDENT);
        student.setFirstName(firstName);
        student.setLastName(lastName);
        student.setMember(false);
        student.setStatus(UserAccount.Status.PENDING_APPLICATION);
        accountRepository.save(student);
    }
}